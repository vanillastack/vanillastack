EFK Cluster Create
=========

Role to deploy EFK - ElasticSearch, Fluentd, Kibana in Kubernetes Cluster.

Requirements
------------

Connection with k8s master node.
There must be ingress controller in place and dns set up for kibana, StorageClass setup and specified in variables of the role.

Example Playbook
----------------

```yaml
- name: install efk
  hosts: master[0]
  gather_facts: true
  roles:
  # EFK init
  - role: install-efk
    action: init
  # EFK elasticsearch
  - role: install-efk
    action: es_deploy
  # EFK kibana
  - role: install-efk
    action: kibana_helm
  # EFK fluentd
  - role: install-efk
    action: fluentd_deploy
```

Author Information
------------------

Kacper Pabian  
kacper.pabian@cloudical.io
