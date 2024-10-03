import { addons } from '@storybook/manager-api';

import SidebarLabelWrapper from './components/SidebarLabelWrapper.tsx';

addons.setConfig({
	sidebar: {
	    renderLabel: (item) => SidebarLabelWrapper({ item }),
    },
});
