<template>
  <div id="app">
    <div class="container">
      <p class="username">{{ currentUser.username }} -  posts:</p>
      <ul>
        <li v-for="post in posts" :key="post.id">{{ post.content }}</li>
      </ul>
      <div>
        <label>Inserir</label>
        <input v-model="newPostContent" />
        <button @click="addPost()">Adicionar Post</button>
      </div>
    </div>
  </div>
</template>

<script>
import { CURRENT_USER, POSTS_BY_USER, ADD_POST } from '@/queries';

function updateAddPost(cache, result) {
  let newPost = result.data.addPost;

  let cacheId = {
    query: POSTS_BY_USER,
    variables: { userId: this.currentUser.id },
  };

  const data = cache.readQuery(cacheId);
  const newData = [...data.postsByUser, newPost];

  cache.writeQuery({
    ...cacheId,
    data: { postsByUser: newData },
  });
}

export default {
  name: 'app',
  data: function () {
    return {
      currentUser: { username: 'user' },
      posts: [],
      newPostContent: '',
    };
  },
  methods: {
    addPost() {
      this.$apollo.mutate({
        mutation: ADD_POST,
        variables: { content: this.newPostContent },
        update: updateAddPost.bind(this),

        optimisticResponse: {
          __typename: 'Mutation',
          addPost: {
            __typename: 'Post',
            id: 'xyz-?',
            content: this.newPostContent,
            userId: this.currentUser.id,
          },
        },
      });
      this.newPostContent = '';
    },
  },

  apollo: {
    currentUser: CURRENT_USER,
    posts: {
      query: POSTS_BY_USER,
      variables() {
        return { userId: this.currentUser.id };
      },
      update(data) {
        return data.postsByUser;
      },
    },
  },
};
</script>

<style lang="css" scoped>
  #app {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
</style>
