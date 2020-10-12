<template>
    <div class="container-fluid">
        <div class="row margin-2em">
            <div class="col">
                <h3>Additional Tools</h3>
            </div>
        </div>
        <div class="row margin-2em">
            <div class="col">
                Here you can select additional tools for your VanillaStack installation. Please select them according to your needs.
            </div>
        </div>
        <div class="row margin-2em form-group">
            <div class="col-1">
                <img src="./images/harbor.png" class="lead-image" />
            </div>
            <div class="col-4 valign-center">
                Harbor is an open source container registry that secures artifacts with policies and role-based access control, ensures images are scanned and free from vulnerabilities, and signs images as trusted.
            </div>
            <div  class="col">
                <div class="custom-control custom-switch inline-block">
                    <input class="custom-control-input" id="harbor" name="harbor" type="checkbox" v-model="installHarbor">
                    <label class="custom-control-label" for="harbor">
                        Install Harbor
                    </label>
                </div>
            </div>
        </div>
        <div class="row margin-2em form-group">
            <div class="col-1">
                <img src="./images/prometheus.png" class="lead-image" />
            </div>
            <div class="col-4 valign-center">
                Prometheus is an open-source event-monitoring and -alerting software. It records real-time metrics in a time series database built using a HTTP pull model, with flexible queries and real-time alerting. Prometheus is widely used in operational environments.
            </div>
            <div class="col">
                <div class="custom-control custom-switch inline-block">
                    <input class="custom-control-input" id="prometheus" name="prometheus" type="checkbox" v-model="installPrometheus">
                    <label class="custom-control-label" for="prometheus">
                        Install Prometheus
                    </label>
                </div>
            </div>
        </div>
        <div class="row margin-2em form-group">
            <div class="col-1">
                <img src="./images/grafana.png" class="lead-image" />
            </div>
            <div class="col-4 valign-center">
                Grafana is an open-source analytics and data-visualization-tool. It runs on multiple platforms, integrates very well with many time-based databases and tools, such as grafana, and is highly customizable and expandable. By the help of a custom query syntax, even complex visualizations and dashboards can be generated.
            </div>
            <div class="col">
                <div class="custom-control custom-switch inline-block">
                    <input class="custom-control-input" id="grafana" name="grafana" type="checkbox" v-model="installGrafana">
                    <label class="custom-control-label" for="grafana">
                        Install Grafana
                    </label>
                </div>
            </div>
        </div>
        <div class="row margin-2em form-group">
            <div class="col-1">
                <img src="./images/elastic.png" class="lead-image" />
            </div>
            <div class="col-4 valign-center">
                Elasticsearch is a search engine, providing a distributed, multi-tenant-capable fulltext-engine accessible via an HTTP-interface. Elasticsearch is one of the most widely used search engines and is enabled for high-availability scenarios and distributed operations. Elasticsearch is very often used with log-aggregation, but can actually process nearly every text-driven data-format.
            </div>
            <div class="col">
                <div class="custom-control custom-switch inline-block">
                    <input class="custom-control-input" id="elastic" name="elastic" type="checkbox" v-model="installElastic">
                    <label class="custom-control-label" for="elastic">
                        Install Elasticsearch
                    </label>
                </div>
            </div>
        </div>
        <div class="row margin-2em form-group">
            <div class="col-1">
                <img src="./images/fluentd.png" class="lead-image" />
            </div>
            <div class="col-4 valign-center">
                Fluentd is a cross platform open-source data collection software. It is typically used for collecting and transforming log data, before they get stored in Elasticsearch. Fluentd is available on different platforms, such as Windows, Linux and Mac OS X.
            </div>
            <div class="col">
                <div class="custom-control custom-switch inline-block">
                    <input class="custom-control-input" id="fluentd" name="fluentd" type="checkbox" v-model="installFluentd">
                    <label class="custom-control-label" for="fluentd">
                        Install Fluentd
                    </label>
                </div>
            </div>
        </div>
        <div class="row margin-2em form-group">
            <div class="col-1">
                <img src="./images/kibana.png" class="lead-image" />
            </div>
            <div class="col-4 valign-center">
                Kibana is a free and open user interface that lets you visualize Elasticsearch data.  Kibana is used as part of the Elastic stack to store, query and visualize log data. One can create bar, line and scatter plots, or pie charts and maps on top of large volumes of data.
            </div>
            <div class="col">
                <div class="custom-control custom-switch inline-block">
                    <input class="custom-control-input" id="kibana" name="kibana" type="checkbox" v-model="installKibana">
                    <label class="custom-control-label" for="kibana">
                        Install Kibana
                    </label>
                </div>
            </div>
        </div>
        <div class="row margin-2em form-group">
            <div class="col-1">
                <img src="./images/jaeger.png" class="lead-image" />
            </div>
            <div class="col-4 valign-center">
                Jaeger is an open source distributed tracing system. It is often used within microservice-based applications to trace their behaviours and to improve performance. Jaeger was developed by Uber Engineering and donated to the CNCF in 2017.     
            </div>
            <div class="col">
                <div class="custom-control custom-switch inline-block">
                    <input class="custom-control-input" id="jaeger" name="jaeger" type="checkbox" v-model="installJaeger">
                    <label class="custom-control-label" for="jaeger">
                        Install Jaeger Tracing
                    </label>
                </div>
            </div>
        </div>
        <div class="row margin-2em form-group">
            <div class="col-1">
                <img src="./images/NGINX-logo.png" class="lead-image" />
            </div>
            <div class="col-4 valign-center">
                Nginx is a web server that can also be used as a reverse proxy, load balancer, mail proxy and HTTP cache. Nginx is free and open-source software. It serves as ingress-controller and therefore routes and manages all incoming HTTP-requests.     
            </div>
            <div class="col">
                <div class="custom-control custom-switch inline-block">
                    <input class="custom-control-input" disabled="disabled" id="nginx" name="nginx" type="checkbox" v-model="installNginx">
                    <label class="custom-control-label" for="nginx">
                        Install Nginx Ingress
                    </label>
                </div>
            </div>
        </div>
        <div class="row margin-2em form-group">
            <div class="col-1">
                <img src="./images/cert-manager.png" class="lead-image" />
            </div>
            <div class="col-4 valign-center">
                cert-manager is a native Kubernetes certificate management controller. It can help with issuing certificates from a variety of sources, such as Let’s Encrypt, HashiCorp Vault, Venafi, a simple signing key pair, or self signed.    
            </div>
            <div class="col">
                <div class="custom-control custom-switch inline-block">
                    <input class="custom-control-input" id="certmgr" name="certmgr" type="checkbox" v-model="installCertmgr" disabled="disabled">
                    <label class="custom-control-label" for="certmgr">
                        Install Cert-Manager
                    </label>
                </div>
            </div>
        </div>
        <div class="row margin-2em form-group">
            <div class="col-1">
                <img src="./images/kubernetes.png" class="lead-image" />
            </div>
            <div class="col-4 valign-center">
                The Kubernetes Dashboard allows to easily manage your Kubernetes installation. It is perhaps not the most feature-rich solution out there, but it gives you a jump-start with managing your workloads    
            </div>
            <div class="col">
                <div class="custom-control custom-switch inline-block">
                    <input class="custom-control-input" id="kubernetes" name="kubernetes" type="checkbox" v-model="installDashboard">
                    <label class="custom-control-label" for="kubernetes">
                        Install Kubernetes Dashboard
                    </label>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Constants from './js/constants.js'
import EventBus from './js/eventBus.js'

export default {
    name: 'tools',

    data: function() {
        return {
            installHarbor: this.$store.state.installer.additional.harbor,
            installPrometheus: this.$store.state.installer.additional.prometheus,
            installGrafana: this.$store.state.installer.additional.grafana,
            installElastic: this.$store.state.installer.additional.elastic,
            installFluentd: this.$store.state.installer.additional.fluentd,
            installKibana: this.$store.state.installer.additional.kibana,
            installJaeger: this.$store.state.installer.additional.jaeger,
            installCertmgr: this.$store.state.installer.additional.certmgr,
            installDashboard: this.$store.state.installer.additional.dashboard,
            installNginx: this.$store.state.installer.additional.nginx,
        }
    },

    mounted : function () {

        // Notify about being loaded
        EventBus.$emit(Constants.Event_NewViewLoaded, {
            allowGoForward: true
        })
    },

    beforeRouteLeave (to, from, next) {
        // Store the data
        this.$store.commit(Constants.Store_AdditionalToolsUpdateData, 
        {
            harbor: this.installHarbor,
            prometheus: this.installPrometheus,
            grafana: this.installGrafana,
            elastic: this.installElastic,
            fluentd: this.installFluentd,
            kibana: this.installKibana,
            dashboard: this.installDashboard,
            certmgr: this.installCertmgr,
            nginx: this.installNginx,
            jaeger: this.installJaeger
        })

        next()
    },

    created: function() {
        console.log("==> Created Home")

    }
}
</script>
