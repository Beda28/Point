CREATE TABLE IF NOT EXISTS users (
    uuid            CHAR(36)                                          NOT NULL PRIMARY KEY,
    id              VARCHAR(128)                                      NOT NULL,
    pw_hash         VARCHAR(255)                                      NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
    pid             CHAR(36)                                          NOT NULL PRIMARY KEY,
    uid             CHAR(36)                                          NOT NULL,
    pname           VARCHAR(255)                                      NOT NULL,
    price           BIGINT                                            NOT NULL,
    content         TEXT                                              NOT NULL,
    created_at      DATETIME(6)                                       NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (uid) REFERENCES users(uuid)
);

CREATE TABLE IF NOT EXISTS transactions (
    tid             CHAR(36)                                          NOT NULL PRIMARY KEY,
    pid             CHAR(36)                                          NOT NULL,
    uid             CHAR(36)                                          NOT NULL,
    quantity        INT                                               NOT NULL,
    unit_price      BIGINT                                            NOT NULL,
    total_amount    BIGINT                                            NOT NULL,
    point_used      BIGINT                                            NOT NULL DEFAULT 0,
    amount          BIGINT                                            NOT NULL,
    status          ENUM('PENDING', 'COMPLETED', 'CANCELED', 'FAILED')  NOT NULL DEFAULT 'PENDING',
    point_tid       CHAR(36)                                          NULL,
    point_refund_tid CHAR(36)                                          NULL,
    created_at      DATETIME(6)                                       NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (pid) REFERENCES products(pid),
    FOREIGN KEY (uid) REFERENCES users(uuid)
);
