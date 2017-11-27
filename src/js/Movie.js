import Reactive from './Reactive';

class Movie extends Reactive {
    constructor(selector, title) {
        let data = {
            title: title
        };
        super(selector, data);
        this.el = selector;
        this.data = data;
    }

    ClearTitle(e){
        this.data.title = '';
    }

    updateTitle(e) {
        this.data['title'] = e.target.value;
    }
}

export default Movie;