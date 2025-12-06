import { useState } from "react";

export type EvaluationTab = "questions" | "suggestions" | "submissions";

export const useEvaluationTabs = (isAdmin: boolean) => {
    const [activeTab, setActiveTab] = useState<EvaluationTab>("questions");

    const tabs: { key: EvaluationTab; label: string; adminOnly?: boolean }[] = [
        { key: "questions", label: "Per Questions" },
        { key: "suggestions", label: "Suggestions / Comments" },
        { key: "submissions", label: "Individual Submissions", adminOnly: true },
    ];

    // Filter tabs based on role
    const visibleTabs = tabs.filter((t) => !t.adminOnly || isAdmin);

    return {
        activeTab,
        setActiveTab,
        visibleTabs,
    };
};
