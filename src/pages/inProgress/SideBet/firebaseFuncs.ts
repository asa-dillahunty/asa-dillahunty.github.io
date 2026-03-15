import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { PolymarketEvent } from "./polymarketFuncs";
import { firebaseDb } from "../../../utils/firestore";

const marketGamesCollection = collection(firebaseDb, "marketGames");

export async function getAllMarketGames(): Promise<MarketGame[]> {
  const snapshot = await getDocs(marketGamesCollection);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<MarketGame, "id">),
  }));
}

export async function getMarketGameById(
  gameId: string,
): Promise<MarketGame | null> {
  const ref = doc(firebaseDb, "marketGames", gameId);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...(snapshot.data() as Omit<MarketGame, "id">),
  };
}

export async function createMarketGame(game: MarketGame): Promise<void> {
  const ref = doc(firebaseDb, "marketGames", game.id);

  await setDoc(ref, {
    events: game.events ?? [],
    createdAt: Date.now(),
  });
}

export async function addEventToMarketGame(
  gameId: string,
  event: PolymarketEvent,
): Promise<void> {
  console.log(gameId);
  const ref = doc(firebaseDb, "marketGames", gameId);
  console.log("gameId");

  await updateDoc(ref, {
    events: arrayUnion(event),
  });
}

export async function removeEventFromMarketGame(
  gameId: string,
  slug: string,
): Promise<void> {
  const ref = doc(firebaseDb, "marketGames", gameId);

  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data() as MarketGame;

  const filtered = (data.events || []).filter((e) => e.slug !== slug);

  await updateDoc(ref, {
    events: filtered,
  });
}

export async function deleteMarketGame(gameId: string): Promise<void> {
  const ref = doc(firebaseDb, "marketGames", gameId);
  await deleteDoc(ref);
}

export function getRandomId() {
  return randomString(3);
}

function randomString(length: number) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var result = "";
  for (var i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export interface MarketGame {
  id: string;
  events: PolymarketEvent[];
  createdAt?: number;
}
