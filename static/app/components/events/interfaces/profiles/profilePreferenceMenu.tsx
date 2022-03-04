import styled from '@emotion/styled';

import Button from 'sentry/components/button';
import ButtonBar from 'sentry/components/buttonBar';
import DropdownButton from 'sentry/components/dropdownButton';
import DropdownControl, {DropdownItem} from 'sentry/components/dropdownControl';
import {t} from 'sentry/locale';
import space from 'sentry/styles/space';
import {FlamegraphPreferences} from 'sentry/utils/profiling/flamegraph/flamegraphPreferencesProvider';

interface ProfilePreferenceMenuProps {
  colorCoding: FlamegraphPreferences['colorCoding'];
  onColorCodingChange: (colorCoding: FlamegraphPreferences['colorCoding']) => void;
  onSortingChange: (sorting: FlamegraphPreferences['sorting']) => void;
  onViewChange: (view: FlamegraphPreferences['view']) => void;
  sorting: FlamegraphPreferences['sorting'];
  view: FlamegraphPreferences['view'];
}

function ProfilePreferenceMenu({
  colorCoding,
  onColorCodingChange,
  sorting,
  onSortingChange,
  view,
  onViewChange,
}: ProfilePreferenceMenuProps): React.ReactElement {
  return (
    <SelectMenuContainer>
      <DropdownControl
        button={({isOpen, getActorProps}) => (
          <DropdownButton
            {...getActorProps()}
            isOpen={isOpen}
            prefix={t('Color Coding By')}
            size="xsmall"
          >
            {COLOR_CODINGS[colorCoding]}
          </DropdownButton>
        )}
      >
        {Object.entries(COLOR_CODINGS).map(
          ([value, label]: [string, string]): React.ReactElement => (
            <DropdownItem
              key={value}
              onSelect={() =>
                onColorCodingChange(value as FlamegraphPreferences['colorCoding'])
              }
              eventKey={value}
              isActive={value === colorCoding}
            >
              {label}
            </DropdownItem>
          )
        )}
      </DropdownControl>
      <ButtonBar merged active={sorting}>
        <Button
          barId="call order"
          size="xsmall"
          onClick={() => onSortingChange('call order')}
        >
          {t('Call Order')}
        </Button>
        <Button
          barId="left heavy"
          size="xsmall"
          onClick={() => onSortingChange('left heavy')}
        >
          {t('Left Heavy')}
        </Button>
      </ButtonBar>
      <ButtonBar merged active={view}>
        <Button barId="bottom up" size="xsmall" onClick={() => onViewChange('bottom up')}>
          {t('Bottom Up')}
        </Button>
        <Button barId="top down" size="xsmall" onClick={() => onViewChange('top down')}>
          {t('Top Down')}
        </Button>
      </ButtonBar>
    </SelectMenuContainer>
  );
}

const SelectMenuContainer = styled('div')`
  display: flex;
  flex-direction: row;
  gap: ${space(0.5)};
  justify-content: flex-start;
`;

const COLOR_CODINGS: Record<FlamegraphPreferences['colorCoding'], string> = {
  'by symbol name': t('Symbol Name'),
  'by library': t('Library'),
  'by system / application': t('System / Application'),
  'by recursion': t('Recursion'),
};

export {ProfilePreferenceMenu};
