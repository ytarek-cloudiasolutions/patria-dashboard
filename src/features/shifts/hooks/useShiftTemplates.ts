import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import shiftTemplatesApi from "../api/shiftTemplatesApi";
import type { ApiShiftTemplate } from "../api/shiftTemplatesApi";
import { to12Hour, to24Hour } from "../utils";
import type { Shift, ShiftFormData } from "../types";
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";

const toShift = (template: ApiShiftTemplate): Shift => ({
  id: template._id,
  name: template.name,
  startTime: to12Hour(template.startTime),
  endTime: to12Hour(template.endTime),
  color: template.color,
  description: template.description,
});

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.message ??
      "Something went wrong"
    );
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong";
};

export const useShiftTemplates = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchShifts = useCallback(async () => {
    setIsLoading(true);
    try {
      const templates = await shiftTemplatesApi.getShiftTemplates();
      setShifts(templates.map(toShift));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShifts();
  }, [fetchShifts]);

  const saveShift = useCallback(
    async (data: ShiftFormData, id?: string) => {
      const payload = {
        name: data.name,
        startTime: to24Hour(data.startTime),
        endTime: to24Hour(data.endTime),
        color: data.color,
        description: data.description,
      };
      try {
        const template = id
          ? await shiftTemplatesApi.updateShiftTemplate(id, payload)
          : await shiftTemplatesApi.createShiftTemplate(payload);
        const shift = toShift(template);
        setShifts((prev) =>
          id
            ? prev.map((s) => (s.id === id ? shift : s))
            : [...prev, shift],
        );
        showSuccessToast(
          id ? "Shift updated successfully" : "Shift created successfully",
        );
      } catch (error) {
        showErrorToast(getErrorMessage(error));
        throw error;
      }
    },
    [],
  );

  const removeShift = useCallback(async (id: string) => {
    try {
      await shiftTemplatesApi.deleteShiftTemplate(id);
      setShifts((prev) => prev.filter((s) => s.id !== id));
      showSuccessToast("Shift deleted successfully");
    } catch (error) {
      showErrorToast(getErrorMessage(error));
      throw error;
    }
  }, []);

  return { shifts, isLoading, fetchShifts, saveShift, removeShift };
};

export default useShiftTemplates;
