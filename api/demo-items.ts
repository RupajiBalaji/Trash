export default function handler(req: any, res: any) {
  res.json([
    {
      category: "Dry/Recyclable",
      item_name: "newspaper",
      kid_reason: "Newspapers can be made into fresh new notebooks! 📚 So they love to go into the blue Dry waste bin!",
      disposal_tip: "Bundle them neatly or fold them flat before putting them away.",
    },
    {
      category: "Wet/Biodegradable",
      item_name: "banana peel",
      kid_reason: "This banana skin turns into super rich food for worms and soil! 🍌 Worms go nom nom nom in the green Wet waste bin!",
      disposal_tip: "Compost it at home or toss it in your organic waste bin.",
    },
    {
      category: "Hazardous",
      item_name: "battery",
      kid_reason: "Whoa! Batteries have special power juice inside that can be dangerous if it leaks ⚡! They need special care in the red Hazardous bin!",
      disposal_tip: "Put tape on the metal ends and drop them at an e-waste recycling box at the store.",
    },
    {
      category: "Dry/Recyclable",
      item_name: "polythene bag",
      kid_reason: "Plastic bags can float away like ghosts! 👻 We must collect them dry so they can be recycled into cool plastic boards!",
      disposal_tip: "Stuff all small bags inside one larger bag to keep them contained.",
    },
    {
      category: "Dry/Recyclable",
      item_name: "old clothes",
      kid_reason: "These clothes are dry and can be shared or made into neat rags! 👕 They stay clean in dry sorting!",
      disposal_tip: "Don't throw them in regular trash! Drop them at a clothes donation point if they are still wearable.",
    },
    {
      category: "Wet/Biodegradable",
      item_name: "apple core",
      kid_reason: "Plants love when apple leftovers turn back into beautiful dirt! 🍎 Happy plants grow from wet compost!",
      disposal_tip: "Keep food waste free from plastic bags or tags.",
    },
  ]);
}
