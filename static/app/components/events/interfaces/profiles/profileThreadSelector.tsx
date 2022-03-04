import styled from '@emotion/styled';

import DropdownAutoComplete from 'sentry/components/dropdownAutoComplete';
import {IconChevron} from 'sentry/icons';
import {t} from 'sentry/locale';
import space from 'sentry/styles/space';
import {ProfileGroup} from 'sentry/utils/profiling/profile/importProfile';

interface ProfileThreadSelectorProps {
  onThreadChange: (index: number) => void;
  profileGroup: ProfileGroup;
}

function ProfileThreadSelector({
  onThreadChange,
  profileGroup,
}: ProfileThreadSelectorProps) {
  return (
    <DropdownAutoComplete
      maxHeight={400}
      onOpen={e => {
        // This can be called multiple times and does not always have `event`
        e?.stopPropagation();
      }}
      onSelect={profile => {
        onThreadChange(profile.value);
      }}
      items={profileGroup.profiles.map((profile, index) => ({
        label: profile.name,
        value: index,
      }))}
      itemSize="small"
      searchPlaceholder={t('Filter threads')}
      menuWithArrow
      emptyHidesInput
    >
      {({isOpen, selectedItem}) => (
        <DropdownButton>
          {selectedItem?.label ??
            profileGroup.profiles[profileGroup.activeProfileIndex].name}
          <StyledChevron direction={isOpen ? 'up' : 'down'} size="xs" />
        </DropdownButton>
      )}
    </DropdownAutoComplete>
  );
}

const DropdownButton = styled('div')`
  display: flex;
  align-items: center;
`;

const StyledChevron = styled(IconChevron)`
  margin-left: ${space(1)};
`;

export {ProfileThreadSelector};
