CREATE TABLE IF NOT EXISTS ipfs_status (
    id text not null default '',
    host_url text not null default  '',
    connect_time text not null default '',
    msg_type text not null default '', 
    msg text not null default '',
    CONSTRAINT pk_ipfs_status PRIMARY KEY (id)
);