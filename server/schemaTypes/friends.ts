export default {
  name: 'friends',
  title: 'Friends',
  type: 'document',
  fields: [
    {
      name: 'userA',
      title: 'userA',
      type: 'reference',
      to: [{type: 'user'}],
    },
    {
      name: 'userB',
      title: 'userB',
      type: 'reference',
      to: [{type: 'user'}],
    },
  ],
}
