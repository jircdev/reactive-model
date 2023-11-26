import { BlogArticleModel } from './model';

/**
 * Simulates the behavior of a blog article model.
 *
 * This function demonstrates the following simulated behaviors:
 * 1. Listening for and logging changes to the 'content' property of a blog article.
 * 2. Listening for and logging updates to the 'views' property of the article.
 * 3. Simulating an update to the article's content after a delay.
 * 4. Simulating the increment of article views at regular intervals.
 *
 * It utilizes the BlogArticleModel class and its methods to demonstrate these behaviors.
 *
 * @function testChanges
 */
export /*bundle*/ function testChanges() {
	const articleModel = new BlogArticleModel();

	console.log('🔄 Setting up listeners for article model properties...');

	// Listen for changes in 'content' property
	articleModel.on('contentUpdated', () => console.log(`Content updated: ${articleModel.content}`));
	console.log('✅ Listener for content update is set.');

	// Listen for changes in 'views' property
	articleModel.on('viewUpdated', () => console.log(`Views count updated: ${articleModel.views}`));
	console.log('✅ Listener for views update is set.');

	console.log('🔄 Starting the simulation of article content update...');
	// Simulate content update of the article
	setTimeout(() => {
		console.log('🔄 Updating the content of the article...');
		articleModel.updateContent('New article content');
	}, 5000); // Updates content after 5 seconds

	console.log('Starting the simulation of article views increment...');
	// Simulate increment of article views
	setInterval(() => {
		console.log('🔄 Incrementing the views of the article...');
		articleModel.incrementViews();
	}, 1000); // Increments views every 1 second
}
