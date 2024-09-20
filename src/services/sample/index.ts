class SampleService {
  posts: { title: string; id: string }[] = [];

  addPost(title: string, id: string) {
    this.posts.push({ title, id });
    return `${title} - ${id}`;
  }
}

export const sampleService = new SampleService();
