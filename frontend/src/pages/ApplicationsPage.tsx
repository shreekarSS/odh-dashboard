import React from 'react';
import { QuestionCircleIcon, WarningTriangleIcon } from '@patternfly/react-icons';
import {
  PageSection,
  PageSectionVariants,
  TextContent,
  Text,
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  Spinner,
  Title,
  EmptyStateBody,
  Split,
  SplitItem,
} from '@patternfly/react-core';

import './ApplicationsPage.scss';

type ApplicationsPageProps = {
  title: string;
  breadcrumb?: React.ReactNode;
  description: React.ReactNode;
  loaded: boolean;
  empty: boolean;
  loadError?: Error;
  children?: React.ReactNode;
  errorMessage?: string;
  emptyMessage?: string;
  emptyStatePage?: React.ReactNode;
  headerAction?: React.ReactNode;
  provideChildrenPadding?: boolean;
};

const ApplicationsPage: React.FC<ApplicationsPageProps> = ({
  title,
  breadcrumb,
  description,
  loaded,
  empty,
  loadError,
  children,
  errorMessage,
  emptyMessage,
  emptyStatePage,
  headerAction,
  provideChildrenPadding,
}) => {
  const renderHeader = () => {
    return (
      <PageSection className="odh-apps__heading" variant={PageSectionVariants.light}>
        {breadcrumb}
        <Split>
          <SplitItem isFilled>
            <TextContent className="odh-apps__heading__text">
              <Text component="h1">{title}</Text>
              <Text component="p">{description}</Text>
            </TextContent>
          </SplitItem>
          {headerAction && <SplitItem>{headerAction}</SplitItem>}
        </Split>
      </PageSection>
    );
  };

  const renderContents = () => {
    if (loadError) {
      return (
        <PageSection>
          <EmptyState variant={EmptyStateVariant.full} data-id="error-empty-state">
            <EmptyStateIcon icon={WarningTriangleIcon} />
            <Title headingLevel="h5" size="lg">
              {errorMessage !== undefined ? errorMessage : 'Error loading components'}
            </Title>
            <EmptyStateBody className="odh-dashboard__error-body">
              <div>
                <code className="odh-dashboard__display-error">{loadError.message}</code>
              </div>
            </EmptyStateBody>
          </EmptyState>
        </PageSection>
      );
    }

    if (!loaded) {
      return (
        <PageSection isFilled>
          <EmptyState variant={EmptyStateVariant.full} data-id="loading-empty-state">
            <Spinner size="xl" />
            <Title headingLevel="h5" size="lg">
              Loading
            </Title>
          </EmptyState>
        </PageSection>
      );
    }

    if (empty) {
      return !emptyStatePage ? (
        <PageSection isFilled>
          <EmptyState variant={EmptyStateVariant.full} data-id="empty-empty-state">
            <EmptyStateIcon icon={QuestionCircleIcon} />
            <Title headingLevel="h5" size="lg">
              {emptyMessage !== undefined ? emptyMessage : 'No Components Found'}
            </Title>
          </EmptyState>
        </PageSection>
      ) : (
        emptyStatePage
      );
    }

    if (provideChildrenPadding) {
      return (
        <PageSection variant="light" isFilled>
          {children}
        </PageSection>
      );
    }

    return children;
  };

  return (
    <>
      {renderHeader()}
      {renderContents()}
    </>
  );
};

export default ApplicationsPage;
