# deploy-velero
Ansible role to deploy Velero to schedule backups.

## Requirements

NFS is required as the backup target.

Note: Don't store backups in the local running Rook / Ceph cluster because its senseless in regards of DR.

## Included Components

* Velero
    * incl. Restic
    * incl. AWS plugin
* Minio
    * as S3 backup target

## Example configuration

```yaml
velero:
  enabled: true
  version: v1.5.2
  chartVersion: 2.13.6
  namespace: velero
  minio:
    enabled: true
    chartVersion: 8.0.2
    nfs:
      size: 50Gi
      server: <NFS SERVER IP>
      path: /srv/nfs
    accessKey: NQhlZ2qufgfe4t6Gi73f4AfTBbGyLob
    secretKey: p7v1jHW8234rfe3ercW3BQNMknrTAJqpUX
```
