export default {
  name: 'group',
  title: 'Group',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'members',
      title: 'Members',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'user'}]}],
    },
  ],
}
