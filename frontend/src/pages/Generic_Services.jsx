import { useParams } from "react-router-dom";

export default function GenericSevices() {
  const { serviceName: service_Name } = useParams();
  
  return (
    <div className="flex justify-center items-center">
      <h4 className="text-[25px] capitalize font-bold pb-2 mb-2">
        My {service_Name}
      </h4>
    </div>
  );
}