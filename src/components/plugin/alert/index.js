/**
 * Vue Plugin Install.
 */

function install(Vue) {

    var AlertConstructor = Vue.extend(require('./alert.vue'));
    var alertInstance = null;

    Object.defineProperty(Vue.prototype, '$alert', {

        get: function () {

            return (message, position) => {
                if (alertInstance) return;
                alertInstance = new AlertConstructor({
                    el: document.createElement('div'),
                    data() {
                        return {
                            message: message,
                            position: position
                        };
                    }
                });
                document.body.appendChild(alertInstance.$el);
                // alertInstance.$appendTo(document.body);
            };
        }

    });
}

if (window.Vue) {
    Vue.use(install);
}

module.exports = install;
