import { sp } from '@pnp/sp';

export interface IComment {
  comment: string;
  date: Date;
  User: string;
}

  // Function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString(); 
  };

export default class CommentService {
  async getComments(): Promise<IComment[]> {
    try {
      const response = await sp.web.lists.getByTitle("CommentV3").items.select("comment", "date", "User").get();
      
      const formattedComments = response.map((comment) => ({
        ...comment,
        date: formatDate(comment.date) 
      }));
      return formattedComments;
    } catch (error) {
      throw new Error('Error fetching comments');
    }
  }

  async postComment(comment: string): Promise<void> {
    try {
      const currentUser = await sp.web.currentUser.get();
      await sp.web.lists.getByTitle("CommentV3").items.add({
        comment: comment,
        date: new Date(),
        User: currentUser.Title,
      });
    } catch (error) {
      throw new Error('Error submitting comment');
    }
  }



}