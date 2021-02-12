Monitoring deploy
=========

Role to deploy Monitoring - Prometheus, Alertmanager, Grafana.

Requirements
------------

Connection with one of clouds Bastion with kubernetes deployed.
Make sure variables are set correctly for your need in `group_vars/all/global.yaml`.

Example Playbook
----------------

```yaml
---
- name: install monitoring
  hosts: master[0]
  gather_facts: true
  roles:
  - role: install-monitoring
    action: operator

```

Author Information
------------------

Kacper Pabian  
kacper.pabian@cloudical.io
