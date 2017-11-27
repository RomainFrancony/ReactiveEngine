class Reactive {
    constructor(selector, dataObj) {
        this.signals = [];
        this.selector = selector;
        this.data = dataObj;
        this.observeData(this.data);
    }


    observeData(obj) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                this.makeReactive(obj, key)
            }
        }
        // We can safely parse the DOM looking for bindings after we converted the dataObject.
        this.parseDOM(document.body, obj)
    }


    parseDOM(node, observable) {
        const text_nodes = document.querySelectorAll(this.selector + ' [s-text]');
        text_nodes.forEach((node) => {
            this.syncNode(node, observable, node.attributes['s-text'].value)
        });


        const model_node = document.querySelectorAll(this.selector + ' [s-model]');
        model_node.forEach((node) => {
            let model = node.getAttribute('s-model');

            // Sync data -> DOM
            this.observe('title',() => {
                node.value = this.data[model];
            });

            // Sync DOM -> data
            node.value = this.data[model];
            node.addEventListener('input', (e) => {
                this.data[model] = e.target.value
            });
        });



        const click_node = document.querySelectorAll(this.selector + ' [s-click]');
        click_node.forEach((node) => {
            let action = node.getAttribute('s-click');
            node.addEventListener('click', (e) => {
                this[action](e);
            });
        })
    }


    makeReactive(obj, key) {
        let val = obj[key];
        let self = this;


        Object.defineProperty(obj, key, {
            get() {
                return val;
            },
            set(newVal) {
                val = newVal;
                self.notify(key)
            }
        })
    }

    notify(signal) {

        if (!this.signals[signal] || this.signals[signal].length < 1) return;

        this.signals[signal].forEach((signalHandler) => signalHandler())
    }


    syncNode(node, observable, property) {
        node.textContent = observable[property];
        this.observe(property, () => node.textContent = observable[property])
    }


    observe(property, signalHandler) {
        if (!this.signals[property]) this.signals[property] = [];

        this.signals[property].push(signalHandler)
    }

}


export default Reactive;