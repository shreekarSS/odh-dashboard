import React from 'react';
import { Label, Tooltip } from '@patternfly/react-core';
import { SyncAltIcon, CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import { QuickStartContext, QuickStartContextValues } from '@patternfly/quickstarts';
import { OdhDocument, OdhDocumentType } from '../types';
import { getQuickStartCompletionStatus, CompletionStatusEnum } from '../utilities/quickStartUtils';
import { DOC_TYPE_TOOLTIPS } from '../utilities/const';
import { getLabelColorForDocType, getDuration } from '../utilities/utils';
import { DOC_TYPE_LABEL } from '../pages/learningCenter/const';

import './OdhCard.scss';

type DocCardBadgesProps = {
  odhDoc: OdhDocument;
};

const DocCardBadges: React.FC<DocCardBadgesProps> = ({ odhDoc }) => {
  const qsContext = React.useContext<QuickStartContextValues>(QuickStartContext);
  const [completionStatus, setCompletionStatus] = React.useState<
    CompletionStatusEnum | undefined
  >();
  const docType = odhDoc?.spec.type as OdhDocumentType;
  const docName = odhDoc?.metadata.name;
  const duration = odhDoc?.spec.durationMinutes;

  React.useEffect(() => {
    if (docType === OdhDocumentType.QuickStart && qsContext.allQuickStarts) {
      const quickStart = qsContext.allQuickStarts.find((qs) => qs.metadata.name === docName);
      if (quickStart) {
        setCompletionStatus(getQuickStartCompletionStatus(quickStart.metadata.name, qsContext));
      }
    }
  }, [qsContext, docType, docName]);

  const label = DOC_TYPE_LABEL[docType] || 'Documentation';

  return (
    <div className="odh-card__doc-badges">
      <Tooltip removeFindDomNode content={DOC_TYPE_TOOLTIPS[docType]}>
        <Label color={getLabelColorForDocType(docType)}>{label}</Label>
      </Tooltip>
      {duration ? (
        <Label variant="outline" color="grey">
          {getDuration(duration)}
        </Label>
      ) : null}
      {completionStatus === CompletionStatusEnum.InProgress ? (
        <Label variant="outline" color="purple" icon={<SyncAltIcon />}>
          In Progress
        </Label>
      ) : null}
      {completionStatus === CompletionStatusEnum.Success ? (
        <Label variant="outline" color="green" icon={<CheckCircleIcon />}>
          Complete
        </Label>
      ) : null}
      {completionStatus === CompletionStatusEnum.Failed ? (
        <Label variant="outline" color="red" icon={<ExclamationCircleIcon />}>
          Failed
        </Label>
      ) : null}
    </div>
  );
};

export default DocCardBadges;
