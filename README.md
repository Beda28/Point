## 1. 문서 개요

```cs
외부 서비스에서 사용할 수 있는 독립형 포인트 지갑 API와 연동 검증용 쇼핑몰을 개발한다.

쇼핑몰은 회원·상품·주문을 관리하고, 
포인트 API는 지갑·잔액·거래 내역을 독립적으로 관리한다. 

두 서비스는 HTTP API로 통신하며, 
잔액 변경의 정합성·동시 요청 처리·중복 요청 방지를 주요 구현 목표로 한다.
```

## 2. 외부 문서 링크

[ 노션 링크 ](https://app.notion.com/p/3f724e53d01d8190b7a7ed2e295487e9)

## 3. 커머스 결제 정책

- 1P는 1원으로 사용하며, 포인트 사용분을 제외한 결제 금액의 1%를 구매확정 시 적립한다.
- 판매 수수료는 상품 총액의 3.3%이며, 수수료와 적립 포인트의 소수점 이하는 버린다.
- 포인트 할인액은 플랫폼이 부담한다. 판매자는 상품 총액에서 수수료를 뺀 금액을 받는다.
- 결제 시 구매자 금액·포인트를 차감하고, 구매확정 시 판매자 정산·구매자 적립을 함께 처리한다.
- 구매확정 전 취소는 결제 금액과 사용 포인트를 반환한다. 구매확정 이후 일반 취소는 제한하며, 별도 분쟁·예외 환불 절차는 구현 범위에 포함하지 않는다.
- 비율은 업계 평균 통계가 아닌 [네이버 기본 적립](https://mkt.naver.com/naverdetails/point)과 [당근 스토어 기본 수수료](https://store-help.daangn.com/)를 참고한 프로젝트 기준이다.
- Commerce는 `payment.policy.ts`로 주문 금액을 저장하고, Point는 `settlement.policy.ts`로 결제 시 판매자·정산액·적립액을 원거래에 저장한다. 정산 요청은 이 값과 일치해야 한다. 정책 변경 시 두 서비스의 비율과 미결제 주문 처리 방식을 함께 변경해야 한다.

## 4. DB 초기화와 기존 DB 변경

Point와 Commerce 모두 `NODE_ENV=development`일 때만 TypeORM 자동 동기화를 사용한다. Compose의 기본값은 개발 환경이다. 배포 환경에서는 `.env`에 `NODE_ENV=production`을 설정한다. 별도 `init.sql`은 사용하지 않는다.

빈 DB를 사용하는 최초 배포에서는 각 서비스 폴더에서 다음 명령을 실행한다. `schema:init`은 기존 테이블이 있으면 중단하며, 실행 중인 서버에서는 DDL을 자동 적용하지 않는다.

```sh
docker compose build backend
docker compose up -d --wait db
docker compose run --rm --no-deps backend npm run schema:init
docker compose up -d
```

기존 DB에는 초기화 명령을 실행하지 않는다. 백업 후 쓰기를 중단하고, 실제 스키마를 확인한 뒤 아래 변경을 한 번 적용한다. MySQL DDL은 자동 커밋되므로 일반 트랜잭션 롤백을 기대하면 안 된다. 개발 자동 동기화로 이미 반영된 변경은 다시 실행하지 않는다.

Point DB:

```sql
ALTER TABLE transactions
  ADD seller_id VARCHAR(128) NULL,
  ADD settle_amount BIGINT NULL,
  ADD reward_point BIGINT NULL;
```

Commerce DB에서는 먼저 중복 아이디 그룹 수를 확인한다. 결과가 0이 아니면 계정과 연결된 주문을 확인해 수동으로 정리한 후 UNIQUE를 추가한다. 기존 회원을 자동 삭제하거나 병합하지 않는다.

```sql
SELECT COUNT(*) AS duplicate_groups
FROM (SELECT id FROM users GROUP BY id HAVING COUNT(*) > 1) AS duplicates;

ALTER TABLE users ADD UNIQUE INDEX uq_users_id (id);
```

기존 Point 거래의 새 컬럼은 NULL로 유지한다. 정산 의도가 없는 기존 결제는 신규 정산을 거절하며 취소는 계속 가능하다. 이전 본문으로 이미 처리된 `PAYING` 주문은 새 본문과 멱등성 해시가 다를 수 있으므로 원거래와 주문을 대조해 별도로 복구해야 한다. 새로운 멱등성 키로 재결제하면 안 된다. 버전별 자동 마이그레이션은 제공하지 않는다.

두 백엔드 Docker 이미지는 소스와 lockfile로 빌드하며, 로컬 `dist`와 `node_modules`를 사용하지 않는다.
