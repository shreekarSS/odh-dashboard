import * as React from 'react';
import { Alert, Button, Form, Modal } from '@patternfly/react-core';
import {
  createProject,
  createRoleBinding,
  generateRoleBindingData,
  updateProject,
} from '../../../../api';
import { useNavigate } from 'react-router-dom';
import { useDashboardNamespace, useUser } from '../../../../redux/selectors';
import { ProjectKind } from '../../../../k8sTypes';
import { getProjectDescription, getProjectDisplayName, isValidK8sName } from '../../utils';
import NameDescriptionField from '../../components/NameDescriptionField';
import { NameDescType } from '../../types';

type ManageProjectModalProps = {
  editProjectData?: ProjectKind;
  open: boolean;
  onClose: () => void;
};

const ManageProjectModal: React.FC<ManageProjectModalProps> = ({
  editProjectData,
  onClose,
  open,
}) => {
  const navigate = useNavigate();
  const [fetching, setFetching] = React.useState(false);
  const [error, setError] = React.useState<Error | undefined>();
  const [nameDesc, setNameDesc] = React.useState<NameDescType>({
    name: '',
    k8sName: undefined,
    description: '',
  });
  const { username } = useUser();
  const { dashboardNamespace } = useDashboardNamespace();

  const canSubmit =
    !fetching && nameDesc.name.trim().length > 0 && isValidK8sName(nameDesc.k8sName);

  const editNameValue = editProjectData ? getProjectDisplayName(editProjectData) : '';
  const editDescriptionValue = editProjectData ? getProjectDescription(editProjectData) : '';
  const editResourceNameValue = editProjectData ? editProjectData.metadata.name : undefined;
  React.useEffect(() => {
    setNameDesc({
      name: editNameValue,
      k8sName: editResourceNameValue,
      description: editDescriptionValue,
    });
  }, [editDescriptionValue, editNameValue, editResourceNameValue]);

  const onBeforeClose = () => {
    onClose();
    setFetching(false);
    setError(undefined);
    setNameDesc({ name: '', k8sName: undefined, description: '' });
  };

  const submit = () => {
    setFetching(true);
    const { name, description, k8sName } = nameDesc;
    if (editProjectData) {
      updateProject(editProjectData, name, description).then(() => onBeforeClose());
    } else {
      createProject(username, name, description, k8sName)
        .then((projectName) => {
          const rbName = `${projectName}-image-pullers`;
          const roleBindingData = generateRoleBindingData(rbName, dashboardNamespace, projectName);
          createRoleBinding(roleBindingData).then(() => navigate(`/projects/${projectName}`));
        })
        .catch((e) => {
          setError(e);
          setFetching(false);
        });
    }
  };

  return (
    <Modal
      title={editProjectData ? 'Edit data science project' : 'Create data science project'}
      variant="medium"
      isOpen={open}
      onClose={onBeforeClose}
      actions={[
        <Button key="confirm" variant="primary" isDisabled={!canSubmit} onClick={submit}>
          {editProjectData ? 'Update' : 'Create'}
        </Button>,
        <Button key="cancel" variant="link" onClick={onBeforeClose}>
          Cancel
        </Button>,
      ]}
    >
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <NameDescriptionField
          nameFieldId="manage-project-modal-name"
          descriptionFieldId="manage-project-modal-description"
          data={nameDesc}
          setData={setNameDesc}
          autoFocusName
          showK8sName
          disableK8sName={!!editProjectData}
        />
      </Form>
      {error && (
        <Alert variant="danger" isInline title="Error creating project">
          {error.message}
        </Alert>
      )}
    </Modal>
  );
};

export default ManageProjectModal;
