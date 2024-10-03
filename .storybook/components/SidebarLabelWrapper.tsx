import React from 'react';

import { ArrowTopRightIcon } from '@storybook/icons'

const SidebarLabelWrapper = ({ item }) => {
  if (item.tags?.includes('url')) {
    const decodedURI = decodeURIComponent(item.id.split('--').pop())
    const title = item.name

    const onClick = (e) => {
      e.preventDefault();
      window.open(decodedURI);
    };

    return (
      <>
        <a
          className='sidebar-link'
          onClick={onClick}
          href={decodedURI}
          target="_blank"
        >
          <ArrowTopRightIcon />
          <span className="sidebar-link-label">{title}</span>
        </a>
        <span className="invisible" aria-hidden>{title}</span>
      </>
    )
  }
};

export default SidebarLabelWrapper;
