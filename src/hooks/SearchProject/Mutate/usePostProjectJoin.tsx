import { postProjectJoin } from "@/apis/TaskPage/project";
import { useMutation } from "@tanstack/react-query";

function usePostProjectJoin(invitecode: string) {
  return useMutation({
    mutationFn: async () => {
      const res = await postProjectJoin(invitecode);
      return res.data;
    },
  });
}

export default usePostProjectJoin;