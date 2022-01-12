ansible-sysctl
==============

[![Build Status](https://travis-ci.org/galexrt/ansible-sysctl.svg?branch=master)](https://travis-ci.org/galexrt/ansible-sysctl)

A simple Ansible role for setting sysctl vars.

Requirements
------------

No special requirements.

Role Variables
--------------

```
sysctl:
  fs.file-max: 2097152
  key: value
```

Dependencies
------------

No dependencies.

Example Playbook
----------------

An example playbook on how to use this role:
```
- hosts: servers
  roles:
    - { role: galexrt.sysctl, sysctl: [{ name: test, value: 100 }] }
```

License
-------

MIT

Author Information
------------------

If you have problems with the role, feel free to create an issue on Github or contact me by mail.
