interface ExplainerPoint {
  text: string;
  nestedPoints?: string[];
}

interface Explainer {
  title: string;
  points: ExplainerPoint[];
}

interface IntroCopy {
  heading: string;
  explainers: Explainer[];
}

const introCopy: IntroCopy = {
  heading: "Time to set up your LifeRPG",
  explainers: [
    {
      title: "Defining your Attributes:",
      points: [
        {
          text: "Attributes like Strength, Dexterity, Vigor, and Intelligence? You can use those! Many adapt some of these archetypal attributes where they make sense. But, since those don't fit neatly into everyone's lives and goals, you should just define what attributes you believe are worth strengthening for yourself.",
        },
        {
          text: "Some suggestions have already been selected, but feel free to remove them. Choose what suits your envisioned lifestyle, put some thought into it and make it make sense.",
          nestedPoints: [
            "The only non-negotiable attribute is Discipline. This is because Discipline is inherently strengthened with every quest completed. The amount Discipline is strengthened is something that can be increased for especially high-effort tasks, but we'll get to that!",
          ],
        },
        {
          text: "When defining your daily quests, the attributes you define will be available when choosing which attributes are strengthened by that quest.",
        },
        {
          text: "Example of Attributes as used by the Creator, just to get an idea:",
          nestedPoints: [
            "Vitality — For general health-giving habits, such as eating healthy and going to bed at the chosen hour",
            "Intelligence — Intellectual pursuits and challenges, reading, etc.",
            "Fitness — Cardio and weight training",
            "Dexterity — Skillfulness with movement, strengthened by sports and even practicing drawing",
            "Creativity — Strengthened by artistic practices like drawing and creative writing",
            "Discipline — Strengthened by all completed quests and consistent daily effort",
          ],
        },
      ],
    },
    {
      title: "Defining your Quests:",
      points: [
        {
          text: "Quests are what will show up every day when you log in, and whose completion will determine your points for the day.",
        },
        {
          text: "When defining a quest, you select which attributes are strengthened by it. Note that attributes level independently — they do not determine how much that quest is worth. Instead, they are present to give you a gauge of what aspects of yourself you are improving each day and a deserved sense of accomplishment in doing so.",
          nestedPoints: [
            "At a minimum, each quest automatically strengthens your Discipline attribute the standard amount.",
            "For each attribute, if a task is especially significant in honing that attribute, up to two + symbols can be added to it. These will increase the points that attribute gains when completing that task. Be honest when making these evaluations!",
          ],
        },
        {
          text: "You have a pool of 100 points to allocate across the quests you've defined. Think of them as shares of the day's total required effort and/or importance. For more significant or more arduous tasks, allocate more points. Do your best to make everything make sense as a whole, granting yourself greater rewards for more important or more difficult tasks while making the smaller tasks feel like easy points.",
        },
      ],
    },
    {
      title: "Other important things to note!",
      points: [
        {
          text: "Try to keep your daily quest size manageable. Your daily points will be negatively affected by incomplete tasks. You can always add more and modify things later.",
        },
        {
          text: "Be honest! Show care when setting how much your attributes are strengthened by a particular task, and in playing this game in general. Do your best to define the game in such a way that it ensures the numbers mean something. We should feel a sense of accomplishment when numbers go up, that doesn't work if we cheat ourselves.",
        },
        {
          text: "There are more details regarding leveling and daily point bonuses (like streaks and quest strength) that would make this introduction even longer. Once you've completed the setup, you can explore the Manual to understand how everything works if you so choose.",
        },
      ],
    },
  ],
};

export default introCopy;
