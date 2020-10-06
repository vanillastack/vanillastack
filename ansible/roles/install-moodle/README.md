Moodle deploy
=========

Role to deploy Moodle.

Requirements
------------

Connection with one of clouds Bastion with kubernetes deployed.
Make sure variables are set correctly for your need in `group_vars/all/global.yaml`.

Example Playbook
----------------

```yaml
---
- name: install moodle
  hosts: master[0]
  gather_facts: true
  roles:
  - role: install-moodle

```

Author Information
------------------

Kacper Pabian  
kacper.pabian@cloudical.io
