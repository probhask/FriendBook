export default {
  name: 'conversation',
  title: 'Conversation',
  type: 'document',
  fields: [
    {
      name: 'userA',
      title: 'UserA',
      type: 'reference',
      to: [{type: 'user'}],
    },
    {
      name: 'userB',
      title: 'UserB',
      type: 'reference',
      to: [{type: 'user'}],
    },
  ],
}
