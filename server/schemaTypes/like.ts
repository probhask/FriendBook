export default {
  name: 'like',
  title: 'Like',
  type: 'document',
  fields: [
    {
      name: 'likeby',
      title: 'LikeBy',
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
