"use client";
import Loading from "@/components/loading";
import { Menu } from "@/components/menu";
import api from "@/lib/axios";
import { TrackerValues } from "@/modules/trackers/services/interface";
import TrackerUpdateForm from "@/modules/trackers/tracker-update-form";
import { DeviceStatus } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateTracker() {
  const [tracker, setTracker] = useState<TrackerValues | null>(null);
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus[] | null>(null);

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const id = Number(params.get("id")) || 0;
  const fetch = async () => {
    try {
      const response = await api.get("tracker/" + id);
      setTracker(response.data.tracker);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  const status = async () => {
    try {
      const response = await api.get("device-status");
      setDeviceStatus(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };

  useEffect(() => {
    fetch();
    status();
  }, []);

  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Atualizar rastreador</h1>
        {tracker && deviceStatus ? (
          <TrackerUpdateForm
            preloadedValues={tracker}
            id={id}
            status={deviceStatus}
          />
        ) : (
          <Loading />
        )}
      </section>
    </>
  );
}
