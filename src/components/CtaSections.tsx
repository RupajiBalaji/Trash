import React from "react";
import { motion } from "motion/react";
import { Info, MapPin, Phone, Globe, Play, Sparkles, AlertCircle } from "lucide-react";

// Bengalore organizations list
const RECYCLING_ORGANIZATIONS = [
  {
    name: "Urban Kabadiwala",
    type: "E-waste & Plastic",
    address: "27 Dodamara Road, Akshaya Layout, Naganathapura, Rayasandra, Bengaluru, 560100",
    phone: "09886681513",
    website: ""
  },
  {
    name: "Prakruthi Recycling Pvt Ltd",
    type: "General Recycling",
    address: "511, 60 Feet Road, A Block RHCS Layout, 2nd Stage, Nagarbhavi, Bengaluru",
    phone: "18001028286",
    website: "https://prakruthirecycling.com/"
  },
  {
    name: "ECO BIRDD RECYCLING COMPANY PVT LTD",
    type: "E-Waste",
    address: "No.185, 1st Cross, 1st Main, Azeez Sait Industrial Estate, Nayandahalli, Bengaluru",
    phone: "09945008827",
    website: "https://www.ecobirddrecycling.com/"
  },
  {
    name: "Aptus E-Waste Recycling Pvt Ltd",
    type: "General Recycling",
    address: "442, 4, 6th Main Road, Yeswanthpur, Bengaluru",
    phone: "08884451461",
    website: "http://www.aptusrecycling.com/"
  },
  {
    name: "U Waste Management",
    type: "Scrap Metal",
    address: "Mysore Road, 6th Cross, Near Rama Temple, Vinayaka Nagar, Bengaluru",
    phone: "09036252572",
    website: "http://uwastemanagement.com/"
  }
];

// DIY crafts videos recommendations
const DIY_CRAFTS = [
  {
    title: "Plastic Bottle Crafts 🍼",
    desc: "Create cool pencil holders, piggy banks, and toys from old plastic bottles!",
    videoUrl: "https://www.youtube.com/watch?v=J6v88r0g7p8",
    thumbnail: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=300&auto=format&fit=crop&q=65"
  },
  {
    title: "Cardboard DIY 📦",
    desc: "Make cardboard houses, storage organizers, or custom desk trays with empty boxes!",
    videoUrl: "https://www.youtube.com/watch?v=P21I9T1e6xY",
    thumbnail: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=300&auto=format&fit=crop&q=65"
  },
  {
    title: "Bottle Planter 🌱🏺",
    desc: "Turn plastic or glass bottles into hanging green planters for your seeds!",
    videoUrl: "https://www.youtube.com/watch?v=E-rUeT9-Efs",
    thumbnail: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=300&auto=format&fit=crop&q=65"
  },
  {
    title: "Paper Crafts 📰🎨",
    desc: "Weave old newspapers into baskets or fold colorful scraps into origami animals!",
    videoUrl: "https://www.youtube.com/watch?v=kYorP96jRz0",
    thumbnail: "https://images.unsplash.com/photo-1526613098299-f558adc485e9?w=300&auto=format&fit=crop&q=65"
  },
  {
    title: "Tin Can Organizer 🥫✏️",
    desc: "Clean empty soup cans and paint them to hold pencils, rulers, and school scissors!",
    videoUrl: "https://www.youtube.com/watch?v=zJgC9M8j73w",
    thumbnail: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=300&auto=format&fit=crop&q=65"
  }
];

// Composting videos
const COMPOSTING_VIDEOS = [
  {
    title: "Easy Home Composting for Kids & Beginners! 🍂",
    desc: "Step-by-step cartoon tutorial explaining how soil helpers break down apple cores and leaves.",
    videoUrl: "https://www.youtube.com/watch?v=Q5s4n9YSxc0",
    thumbnail: "https://images.unsplash.com/photo-1545241047-6083a3684587?w=300&auto=format&fit=crop&q=65"
  },
  {
    title: "The Magic of Worms & Soil Composting! 🪱",
    desc: "Watch how friendly worms eat leftovers and create high-grade fertilizer naturally.",
    videoUrl: "https://www.youtube.com/watch?v=ishA6kry8nc",
    thumbnail: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=300&auto=format&fit=crop&q=65"
  }
];

interface CtaProps {
  onCompleteActivity: (points: number, name: string) => void;
}

export const RecycleCta: React.FC<CtaProps> = ({ onCompleteActivity }) => {
  return (
    <div className="bg-white rounded-3xl border-3 border-blue-500 p-5 shadow-[0_5px_0_0_#3b82f6] space-y-4 text-left">
      <div className="flex items-center gap-2 border-b-2 border-blue-100 pb-2.5">
        <span className="text-2.5xl animate-bounce">♻️</span>
        <div>
          <h4 className="font-display font-black text-blue-900 text-sm">Recycle Nearby CTA</h4>
          <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Take your waste to a nearby recycling organization.</p>
        </div>
      </div>

      <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
        {RECYCLING_ORGANIZATIONS.map((org, index) => (
          <div
            key={index}
            className="p-3 bg-blue-50/50 border-2 border-blue-100 rounded-2xl flex flex-col gap-2 hover:bg-blue-50 transition-colors"
          >
            <div>
              <div className="flex justify-between items-center">
                <h5 className="font-display font-bold text-xs text-blue-900">{org.name}</h5>
                <span className="bg-blue-200 text-blue-800 text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                  {org.type}
                </span>
              </div>
              <p className="text-[10px] text-gray-500 mt-1 flex items-start gap-1 leading-normal">
                <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                <span>{org.address}</span>
              </p>
            </div>

            <div className="flex gap-2 justify-end border-t border-blue-100/40 pt-1.5">
              <a
                href={`tel:${org.phone}`}
                onClick={() => onCompleteActivity(8, `Called ${org.name} 📞`)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-2xs transition-all active:scale-95"
              >
                <Phone className="w-3 h-3" /> Call Organization
              </a>

              {org.website && (
                <a
                  href={org.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onCompleteActivity(8, `Visited ${org.name} website 🌐`)}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-2xs transition-all active:scale-95"
                >
                  <Globe className="w-3 h-3" /> Visit Website
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ReuseCta: React.FC<CtaProps> = ({ onCompleteActivity }) => {
  return (
    <div className="bg-white rounded-3xl border-3 border-amber-400 p-5 shadow-[0_5px_0_0_#fbbf24] space-y-4 text-left">
      <div className="flex items-center gap-2 border-b-2 border-amber-100 pb-2.5">
        <span className="text-2.5xl">🎨</span>
        <div>
          <h4 className="font-display font-black text-amber-900 text-sm">Reuse & DIY Crafts Section</h4>
          <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Turn this item into a creative playground project!</p>
        </div>
      </div>

      <div className="space-y-3">
        {DIY_CRAFTS.map((craft, idx) => (
          <div
            key={idx}
            className="flex gap-3 items-start bg-amber-50/20 hover:bg-amber-50/50 p-2.5 rounded-2xl border border-amber-100/60 transition-all"
          >
            <div className="w-20 h-14 rounded-xl overflow-hidden shrink-0 border border-amber-200 relative">
              <img src={craft.thumbnail} alt={craft.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-red-600/10 flex items-center justify-center">
                <span className="bg-red-600 text-white rounded-full p-1 shadow-md scale-75 leading-none">▶️</span>
              </div>
            </div>
            <div className="flex-1 min-w-0 text-left">
              <h5 className="font-display font-bold text-xs text-gray-800 leading-snug truncate">
                {craft.title}
              </h5>
              <p className="text-[9px] text-gray-500 line-clamp-2 mt-0.5 leading-relaxed font-medium">
                {craft.desc}
              </p>
              <a
                href={craft.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onCompleteActivity(15, `Started DIY ${craft.title} ✂️`)}
                className="inline-flex items-center gap-1 text-[10px] font-black text-red-600 hover:text-red-700 hover:underline mt-1.5"
              >
                Watch on YouTube 📺
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CompostSuggestion: React.FC<CtaProps> = ({ onCompleteActivity }) => {
  return (
    <div className="bg-white rounded-3xl border-3 border-emerald-500 p-5 shadow-[0_5px_0_0_#10b981] space-y-4 text-left">
      <div className="flex items-center gap-2 border-b-2 border-emerald-100 pb-2.5">
        <span className="text-2.5xl animate-pulse">🌱</span>
        <div>
          <h4 className="font-display font-black text-emerald-900 text-sm">Compost This Instead!</h4>
          <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Feed the Earth, not the landfill!</p>
        </div>
      </div>

      <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-3.5 space-y-3.5">
        <div>
          <h5 className="font-display font-bold text-xs text-emerald-900 flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-amber-500" /> Why Composting is Awesome:
          </h5>
          <p className="text-[11px] text-emerald-800 mt-1 leading-relaxed">
            Composting turns leftover fruits, veggies, and leaves into super-rich vitamins for the soil! It feeds cute garden worms and growing plants, and saves space in noisy trash landfills.
          </p>
        </div>

        <div>
          <h5 className="font-display font-bold text-xs text-emerald-900 flex items-center gap-1">
            🌿 Simple Home Composting Steps:
          </h5>
          <ol className="text-[10.5px] text-emerald-800 list-decimal pl-4.5 mt-1 space-y-1 font-medium">
            <li><span className="font-bold">Poke Holes:</span> Get a small bin or clay pot and poke small holes for fresh air!</li>
            <li><span className="font-bold">Add Layers:</span> Toss in food scraps (<span className="text-emerald-600 font-bold">Greens</span>) and dry leaves or shredded cardboard (<span className="text-amber-700 font-bold">Browns</span>).</li>
            <li><span className="font-bold">Stir & Sprinkle:</span> Sprinkle a tiny bit of water and stir it once a week like cake batter!</li>
          </ol>
        </div>

        <div>
          <h5 className="font-display font-bold text-xs text-emerald-900">
            ☀️ Amazing Benefits:
          </h5>
          <p className="text-[11px] text-emerald-800 mt-1">
            🏆 Grow beautiful backyard flowers, create free nutrient soil, and become an Eco Superhero!
          </p>
        </div>
      </div>

      {/* Composting Videos */}
      <div className="space-y-3 pt-1">
        <h5 className="font-display font-bold text-xs text-gray-700">📽️ Kids Composting Videos:</h5>
        {COMPOSTING_VIDEOS.map((video, idx) => (
          <div
            key={idx}
            className="flex gap-3 items-start bg-emerald-50/20 hover:bg-emerald-50/40 p-2.5 rounded-2xl border border-emerald-100/50 transition-all"
          >
            <div className="w-18 h-12 rounded-lg overflow-hidden shrink-0 border border-emerald-200 relative">
              <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-red-600/10 flex items-center justify-center">
                <span className="bg-red-600 text-white rounded-full p-0.5 shadow-md scale-75 leading-none">▶️</span>
              </div>
            </div>
            <div className="flex-1 min-w-0 text-left">
              <h6 className="font-display font-bold text-[11px] text-gray-800 truncate leading-tight">
                {video.title}
              </h6>
              <a
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onCompleteActivity(10, "Learnt Composting 🌿")}
                className="inline-flex items-center gap-1 text-[10px] font-black text-red-600 hover:text-red-700 hover:underline mt-1"
              >
                Watch on YouTube 📺
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
