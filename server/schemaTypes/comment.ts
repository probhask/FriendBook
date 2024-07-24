export default {
  name: 'comment',
  title: 'Comment',
  type: 'document',
  fields: [
    {
      name: 'comments',
      title: 'Comments',
      type: 'string',
    },
    {
      name: 'postedBy',
      title: 'PostedBy',
      type: 'reference',
      to: [{type: 'user'}],
    },
    {
      name: 'post',
      title: 'Post',
      type: 'reference',
      to: [{type: 'post'}],
    },
  ],
}
