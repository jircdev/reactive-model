import { ReactiveModel } from '@beyond-js/reactive/model';

// This model belongs to the use case of: Reactive model basics fucntionality

interface IBlogArticle {
	title: string;
	content: string;
	views: number;
}

export class BlogArticleModel extends ReactiveModel<IBlogArticle> {
	title: string;
	content: string;
	views: number;

	constructor() {
		super();
		this.reactiveProps<IBlogArticle>(['title', 'content', 'views']);
	}

	/**
	 * Aumenta el número de vistas y dispara un evento personalizado 'viewUpdated'.
	 */
	incrementViews() {
		this.views++;
		this.triggerEvent('viewUpdated');
	}

	/**
	 * Actualiza el contenido del artículo y dispara un evento 'contentUpdated'.
	 * @param newContent El nuevo contenido del artículo.
	 */
	updateContent(newContent: string) {
		this.content = newContent;
		this.triggerEvent('contentUpdated');
	}
}
