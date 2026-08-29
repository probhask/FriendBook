export default {
  name: 'stories',
  title: 'Stories',
  type: 'document',
  fields: [
    {
      name: 'mediaType',
      title: 'Media Type',
      type: 'string',
      options: {
        list: [
          {title: 'Image', value: 'image'},
          {title: 'Video', value: 'video'},
        ],
        layout: 'radio',
      },
      initialValue: 'image',
    },
    {
      name: 'media',
      title: 'Media (image)',
      type: 'image',
    },
    {
      name: 'video',
      title: 'Video',
      type: 'file',
      options: {accept: 'video/*'},
    },
    {
      name: 'postedBy',
      title: 'PostedBy',
      type: 'reference',
      to: [{type: 'user'}],
    },
  ],
  preview: {
    select: {subtitle: 'mediaType', media: 'media'},
  },
}
