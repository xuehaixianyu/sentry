import {withRouter, WithRouterProps} from 'react-router';
import styled from '@emotion/styled';

import {pinFilter, updateDateTime} from 'sentry/actionCreators/pageFilters';
import Button from 'sentry/components/button';
import DropdownButton from 'sentry/components/dropdownButton';
import TimeRangeSelector, {
  ChangeData,
} from 'sentry/components/organizations/timeRangeSelector';
import PageTimeRangeSelector from 'sentry/components/pageTimeRangeSelector';
import {IconCalendar, IconPin} from 'sentry/icons';
import {t} from 'sentry/locale';
import PageFiltersStore from 'sentry/stores/pageFiltersStore';
import {useLegacyStore} from 'sentry/stores/useLegacyStore';
import space from 'sentry/styles/space';
import useOrganization from 'sentry/utils/useOrganization';

type Props = Omit<
  React.ComponentProps<typeof TimeRangeSelector>,
  'organization' | 'start' | 'end' | 'utc' | 'relative' | 'onUpdate'
> & {
  router: WithRouterProps['router'];
  /**
   * Reset these URL params when we fire actions (custom routing only)
   */
  resetParamsOnChange?: string[];

  /**
   * Whether the trigger button should be borderless
   */
  borderless?: boolean;

  hidePin?: boolean;
};

function DatePageFilter({
  router,
  resetParamsOnChange,
  borderless,
  hidePin,
  ...props
}: Props) {
  const {selection, pinnedFilters} = useLegacyStore(PageFiltersStore);
  const organization = useOrganization();
  const {start, end, period, utc} = selection.datetime;

  const isDatePinned = pinnedFilters.has('datetime');

  const handleUpdate = (timePeriodUpdate: ChangeData) => {
    const {relative, ...startEndUtc} = timePeriodUpdate;
    const newTimePeriod = {
      period: relative,
      ...startEndUtc,
    };

    updateDateTime(newTimePeriod, router, {save: true, resetParams: resetParamsOnChange});
  };

  const handlePinClick = () => {
    pinFilter('datetime', !isDatePinned);
  };

  const customDropdownButton = ({getActorProps, isOpen}) => {
    let label;
    if (start && end) {
      const startString = start.toLocaleString('default', {
        month: 'short',
        day: 'numeric',
      });
      const endString = end.toLocaleString('default', {month: 'short', day: 'numeric'});
      label = `${startString} - ${endString}`;
    } else {
      label = period?.toUpperCase();
    }

    return (
      <StyledDropdownButton
        isOpen={isOpen}
        icon={<IconCalendar />}
        borderless={borderless}
        {...getActorProps()}
      >
        <DropdownTitle>
          <TitleContainer>{label}</TitleContainer>
        </DropdownTitle>
      </StyledDropdownButton>
    );
  };

  return (
    <DateSelectorContainer>
      <StyledPageTimeRangeSelector
        organization={organization}
        start={start}
        end={end}
        relative={period}
        utc={utc}
        onUpdate={handleUpdate}
        label={<IconCalendar color="textColor" />}
        customDropdownButton={customDropdownButton}
        detached
        {...props}
      />
      {!hidePin && (
        <PinButton
          aria-pressed={isDatePinned}
          aria-label={t('Pin')}
          onClick={handlePinClick}
          size="zero"
          icon={<IconPin size="xs" isSolid={isDatePinned} />}
          borderless
        />
      )}
    </DateSelectorContainer>
  );
}

const DateSelectorContainer = styled('div')`
  position: relative;
  display: flex;
  align-items: center;
  flex: 0 0 fit-content;
`;

const StyledPageTimeRangeSelector = styled(PageTimeRangeSelector)`
  font-weight: 600;
  width: 100%;
  height: 100%;
  min-height: auto;
  background: ${p => p.theme.background};
  border: none;
  box-shadow: none;
`;

const StyledDropdownButton = styled(DropdownButton)`
  width: 100%;
  height: 100%;
  min-height: auto;
  text-overflow: ellipsis;
`;

const TitleContainer = styled('div')`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  flex: 1 1 0%;
`;

const DropdownTitle = styled('div')`
  display: flex;
  overflow: hidden;
  align-items: center;
  flex: 1;
`;

const PinButton = styled(Button)`
  display: block;
  color: ${p => p.theme.gray300};
  background: transparent;
  margin-left: ${space(1)};
`;

export default withRouter<Props>(DatePageFilter);
