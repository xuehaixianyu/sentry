import React from 'react';

import FeatureDisabled from 'sentry/components/acl/featureDisabled';
import Button from 'sentry/components/button';
import {Hovercard} from 'sentry/components/hovercard';
import {IconMail} from 'sentry/icons';
import {t} from 'sentry/locale';

type InviteMembersButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

function InviteMembersButton({disabled, onClick}: InviteMembersButtonProps) {
  const action = (
    <Button
      priority="primary"
      size="small"
      onClick={onClick}
      data-test-id="email-invite"
      icon={<IconMail />}
      disabled={disabled}
    >
      {t('Invite Members')}
    </Button>
  );

  return disabled ? (
    <Hovercard
      body={
        <FeatureDisabled
          featureName="Invite Members"
          features={['organizations:invite-members']}
          hideHelpToggle
        />
      }
    >
      {action}
    </Hovercard>
  ) : (
    action
  );
}

export default InviteMembersButton;
