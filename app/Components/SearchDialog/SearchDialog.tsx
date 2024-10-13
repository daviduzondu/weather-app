"use client";
import {
 useGlobalContext,
 useGlobalContextUpdate,
} from "@/app/context/globalContext";
import { commandIcon } from "@/app/utils/Icons";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CommandList } from "cmdk";
import React, { useEffect, useState } from "react";

function SearchDialog() {
 const { geoCodedList, inputValue, handleInput, forecast } = useGlobalContext();
 const { setActiveCityCoords } = useGlobalContextUpdate();
 const [isOpen, setIsOpen] = useState(false); // State to manage dialog visibility

 const getClickedCoords = (lat: number, lon: number) => {
  setActiveCityCoords([lat, lon]);
 };

 useEffect(() => {
  if (forecast) {
   setIsOpen(false);
  }
 }, [forecast]);

 return (
  <div className="search-btn">
   <Dialog open={isOpen} onOpenChange={setIsOpen}> 
    <DialogTrigger asChild>
     <Button
      variant="outline"
      onClick={() => setIsOpen(true)} // Open dialog on click
      className="border inline-flex items-center justify-center text-sm font-medium hover:dark:bg-[#131313] hover:bg-slate-100 ease-in-out duration-200"
     >
      <p className="text-sm text-muted-foreground">Search Here...</p>
      <div className="command dark:bg-[#262626] bg-slate-200 py-[2px] pl-[5px] pr-[7px] rounded-sm ml-[10rem] flex items-center gap-2">
       {commandIcon}
       <span className="text-[9px]">F</span>
      </div>
     </Button>
    </DialogTrigger>

    <DialogContent className="p-0 z-[200]">
     <Command className="rounded-lg border shadow-md" loop shouldFilter={false}>
      <CommandInput
       value={inputValue}
       onChangeCapture={handleInput}
       placeholder="Type a command or search..."
      />

      <CommandList>
       {(!Array.isArray(geoCodedList) || geoCodedList.length === 0) && (
        <CommandEmpty>
         {geoCodedList.loading ? <div>Loading...</div> : null}
         {geoCodedList?.length === 0 && <p>No Results found</p>}
        </CommandEmpty>
       )}

       {Array.isArray(geoCodedList) && geoCodedList.length > 0 && (
        <CommandGroup heading="Suggestions">
         {geoCodedList.map(
          (
           item: {
            name: string;
            country: string;
            state: string;
            lat: number;
            lon: number;
           },
           index: number
          ) => {
           const { country, state, name } = item;
           return (
            <CommandItem
             key={index}
             className={`py-3 px-2 text-sm rounded-sm cursor-default`}
             onSelect={() => getClickedCoords(item.lat, item.lon)}
            >
             <p className="text">
              {name}, {state && `${state},`} {country}
             </p>
            </CommandItem>
           );
          }
         )}
        </CommandGroup>
       )}
      </CommandList>
     </Command>
    </DialogContent>
   </Dialog>
  </div>
 );
}

export default SearchDialog;
