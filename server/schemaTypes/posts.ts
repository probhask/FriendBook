export default {
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    {
      name: 'postDesc',
      title: 'Post Description',
      type: 'string',
    },
    {
      name: 'mediaType',
      title: 'Media Type',
      type: 'string',
      options: {
        list: [
          {title: 'Image', value: 'image'},
          {title: 'Video', value: 'video'},
          {title: 'Image + Audio', value: 'audioImage'},
        ],
        layout: 'radio',
      },
      initialValue: 'image',
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
      name: 'video',
      title: 'Video',
      type: 'file',
      options: {accept: 'video/*'},
    },
    {
      name: 'audio',
      title: 'Audio track (for Image + Audio posts)',
      type: 'file',
      options: {accept: 'audio/*'},
    },
    {
      name: 'audioMeta',
      title: 'Audio trim',
      type: 'object',
      fields: [
        {name: 'trackName', title: 'Track name', type: 'string'},
        {name: 'startSec', title: 'Start (seconds)', type: 'number'},
        {name: 'endSec', title: 'End (seconds)', type: 'number'},
      ],
    },
    {
      name: 'tagUser',
      title: 'Tag User',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'user'}]}],
    },
    {
      name: 'postedBy',
      title: 'PostedBy',
      type: 'reference',
      to: [{type: 'user'}],
    },
  ],
  preview: {
    select: {title: 'postDesc', subtitle: 'mediaType', media: 'image'},
  },
}
