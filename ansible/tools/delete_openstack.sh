#!/bin/bash
kubectl exec -ti $(kubectl get po -n rook-ceph|grep tool|cut -d" " -f1) -n rook-ceph -- ceph auth rm client.glance
kubectl exec -ti $(kubectl get po -n rook-ceph|grep tool|cut -d" " -f1) -n rook-ceph -- ceph auth rm client.cinder
kubectl exec -ti $(kubectl get po -n rook-ceph|grep tool|cut -d" " -f1) -n rook-ceph -- ceph osd pool rm glance.images glance.images --yes-i-really-really-mean-it
kubectl exec -ti $(kubectl get po -n rook-ceph|grep tool|cut -d" " -f1) -n rook-ceph -- ceph osd pool rm cinder.volumes cinder.volumes --yes-i-really-really-mean-it
kubectl exec -ti $(kubectl get po -n rook-ceph|grep tool|cut -d" " -f1) -n rook-ceph -- ceph osd pool rm cinder.backups cinder.backups --yes-i-really-really-mean-it
for i in mariadb rabbitmq memcached keystone glance cinder horizon neutron nova openvswitch libvirt heat barbican senlin mistral congress; do
	helm delete --no-hooks $i --namespace openstack

done
for i in $(kubectl get pvc -n openstack |cut -d" " -f1); do 
	kubectl delete pvc -n openstack $i
done
kubectl delete ns openstack
for i in $(kubectl get pv|grep openstack|cut -d" " -f1); do
	kubectl delete pv $i
done
