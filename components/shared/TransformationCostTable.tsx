import { transformationCosts, transformationTypes } from "@/constants";

// components/TransformationCostTable.tsx
type TransformationItem = {
  feature: string;
  description: string;
  icon: string;
  credits: number;
};



 function TransformationCostTable() {
  const rows: TransformationItem[] = Object.keys(transformationTypes).map((key) => {
    const t = transformationTypes[key as keyof typeof transformationTypes];
    const credits = transformationCosts[key] ?? 0;

    return {
      feature: t.title,
      description: t.subTitle,
      icon: t.icon,
      credits,
    };
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">Transformation Costs</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-3 text-sm font-medium text-gray-600">Feature</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-600">Description</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-600">Credits</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ feature, description, credits }) => (
              <tr key={feature} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-800">{feature}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{description}</td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">{credits}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransformationCostTable;
