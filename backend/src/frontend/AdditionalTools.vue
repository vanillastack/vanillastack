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
                <img src="/images/harbor.png" class="lead-image" />
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
                <img src="/images/prometheus.png" class="lead-image" />
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
                <img src="/images/grafana.png" class="lead-image" />
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
                <img src="/images/elastic.png" class="lead-image" />
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
                <img src="/images/fluentd.png" class="lead-image" />
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
                <img src="/images/kibana.png" class="lead-image" />
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
                <img src="/images/kubernetes.png" class="lead-image" />
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
    name: 'Additional Tools',

    data: function() {
        return {
            installHarbor: this.$store.state.installer.harbor,
            installPrometheus: this.$store.state.installer.prometheus,
            installGrafana: this.$store.state.installer.grafana,
            installElastic: this.$store.state.installer.elastic,
            installFluentd: this.$store.state.installer.fluentd,
            installKibana: this.$store.state.installer.kibana,
            installJaeger: this.$store.state.installer.jaeger,
            installCertmgr: this.$store.state.installer.certmgr,
            installDashboard: this.$store.state.installer.dashboard,
        }
    },

    mounted : function () {
        console.log("==> Loaded Home")

        // Notify about being loaded
        EventBus.$emit(Constants.Event_NewViewLoaded, {
            allowGoForward: true
        })
    },

    created: function() {
        console.log("==> Created Home")

    }
}
</script>