import Card from "../../../components/Card";

const MyStats = () => {
  return (
    <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
      <Card title="Deposits" data={undefined} />
      <Card title="In Play" data={undefined} />
      <Card title="Profits" data={undefined} />
    </dl>
  );
};

export default MyStats;
