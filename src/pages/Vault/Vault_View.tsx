import { PageLayout } from "../../components";

type Props = {};

const VaultView: React.FC<Props> = () => {
  return (
    <PageLayout requiresAuth={false}>
      <div className="flex flex-col">
      <h3 className="text-lg mb-3 font-medium text-gray-900">Vault </h3>
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <p>Stats</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default VaultView;
