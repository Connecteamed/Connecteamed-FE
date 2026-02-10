import { postTask } from "@/apis/TaskPage/task";
import { QUERY_KEY } from "@/constants/key";
import type { RequestPostTaskDTO } from "@/types/TaskManagement/task";
import { queryClient } from "@/utils/queryClient";
import { useMutation } from "@tanstack/react-query";

function usePostTask(projectId: number) {
    return useMutation({
        mutationFn: (task: RequestPostTaskDTO) => postTask(projectId, task),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.taskList, projectId],
            });
        },
    });
}

export default usePostTask;
