# Point Backend

포인트 API의 NestJS 백엔드입니다.

## 구조

```text
src/
  main.ts
  app.module.ts
  point/
    point.module.ts
    point.controller.ts
    point.service.ts
```

`AppModule`에서 `PointModule`을 가져오고, `PointModule`에 컨트롤러와 서비스를 등록합니다. 현재는 모듈 구조만 구성되어 있으며 API는 아직 구현하지 않았습니다.

## 실행

```powershell
npm.cmd ci
npm.cmd run start:dev
```

## 빌드 및 코드 검사

```powershell
npm.cmd run build
npm.cmd run lint
```

Docker 이미지는 로컬의 `dist`를 사용하므로 먼저 빌드해야 합니다.
