const stages = [
  {
    name: "制片段",
    steps: [
      { id: "zew-1", label: "正极搅拌" },
      { id: "zew-2", label: "陶瓷搅拌" },
      { id: "zew-3", label: "正极底涂", prev: ["zew-1", "zew-2"] },
      { id: "zew-4", label: "正极涂布", prev: ["zew-3"] },
      { id: "zew-5", label: "正极辊压分切", prev: ["zew-4"] },

      { id: "few-1", label: "负极搅拌" },
      { id: "few-2", label: "负极涂布", prev: ["few-1"] },
      { id: "few-3", label: "负极冷压分切", prev: ["few-2"] },
    ]
  },
  {
    name: "切叠段",
    steps: [
      { id: "cs-1", label: "极片库", prev: ["zew-5", "few-3"] },
      { id: "cs-2", label: "切叠热复核", prev: ["cs-1"] },
    ]
  },
  {
    name: "组装段",
    steps: [
      { id: "a1", label: "X-ray01", prev: ["cs-2"] },
      { id: "a2", label: "极耳预焊", prev: ["a1"] },
      { id: "a3", label: "极耳终焊", prev: ["a2"] },
      { id: "a4", label: "盖板&连接片焊接前", prev: ["a3"] },
      { id: "a5", label: "包PET膜", prev: ["a4"] },
      { id: "a6", label: "入壳预焊", prev: ["a5"] },
      { id: "a7", label: "盖板满焊", prev: ["a6"] },
      { id: "a8", label: "X-ray02", prev: ["a7"] },
      { id: "a9", label: "前氦检", prev: ["a8"] },
      { id: "a10", label: "真空烘烤", prev: ["a9"] },
    ]
  },
  {
    name: "化成段",
    steps: [
      { id: "f1", label: "高温静置1", prev: ["a10"] },
      { id: "f2", label: "OCV0", prev: ["f1"] },
      { id: "f3", label: "化成", prev: ["f2"] },
      { id: "f4", label: "高温静置2", prev: ["f3"] },
      { id: "f5", label: "OCV1", prev: ["f4"] },
      { id: "f6", label: "筛选1", prev: ["f5"] },
      { id: "f7", label: "密封钉焊", prev: ["f6"] },
      { id: "f8", label: "调SOC(分容)", prev: ["f7"] },
      { id: "f9", label: "常温静置1", prev: ["f8"] },
      { id: "f10", label: "OCV2", prev: ["f9"] },
      { id: "f11", label: "高温静置3", prev: ["f10"] },
      { id: "f12", label: "常温静置2", prev: ["f11"] },
      { id: "f13", label: "OCV3", prev: ["f12"] },
      { id: "f14", label: "筛选2", prev: ["f13"] },
      { id: "f15", label: "半成品立库", prev: ["f14"] },
      { id: "f16", label: "OCV4", prev: ["f15"] },
      { id: "f17", label: "筛选3", prev: ["f16"] },
      { id: "f18", label: "补电", prev: ["f17"] },
      { id: "f19", label: "DCIR", prev: ["f18"] },
      { id: "f20", label: "筛选4", prev: ["f19"] },
      { id: "f21", label: "清洗", prev: ["f20"] },
      { id: "f22", label: "清洗", prev: ["f21"] },
      { id: "f23", label: "UV喷涂", prev: ["f22"] },
      { id: "f24", label: "下线检测", prev: ["f23"] },
      { id: "f25", label: "装箱", prev: ["f24"] },
    ]
  }
];

export { stages };  // 添加这行来导出 stages
