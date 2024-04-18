class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); //Sets story title
        this.engine.show("You have been stuck in this abandoned mall for hours. You need to find a way out!");
        this.engine.addChoice("Begin the story");
        this.engine.powerOn = false;
        this.engine.haveKey = false;
        this.engine.exitOpen = false;
        this.engine.car = false;
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); //Set starting location
    }
}

class Location extends Scene {
    create(key) {
        //NOTE: key is a string of a location
        let locationData = key; //Use key var to get the data object for the current story location
        this.engine.show(this.engine.storyData.Locations[locationData].Body); //Displays info about current location
        
        if(this.engine.storyData.Locations[locationData].Choices) { //Check if the location has any Choices
            for(let choice of this.engine.storyData.Locations[locationData].Choices) { //Loop over the location's Choices
                this.engine.addChoice(choice.Text, choice); //Second argument gets passed to handleChoice()
            }
        }

        if(locationData == "Restaurant" && this.engine.car) { //If player has the RC Car
            this.engine.haveKey = true;
            this.engine.show("You place down the RC Car and drive it through the gap in the rubble. You retrieve the security office keycard.");
        }

        if(locationData == "MainEntrance" && this.engine.exitOpen) { //If the exit is open, end the game
            this.engine.show("You successfully escaped the mall!");
            this.engine.gotoScene(End);


        } 
    }

    //TODO: Maybe implement a switch case to check the target locations?
    //Note: See README.txt for more info about this function
    handleChoice(choice) {
        if(choice.Target == "UpperLevel" && !this.engine.powerOn) { //Checks for items/events
            this.noPower();
        } else if (choice.Target == "SecurityOffice" && !this.engine.haveKey) {
            this.noKey();
        } else if (choice.Text == "Search the kiosk") { //Choice options
            this.getCar();
        } else if (choice.Text == "Flip the breaker") {
            this.turnOnPower();
        } else if (choice.Text == "Push the button") {
            this.openExit();
        } else if (choice) {
            this.engine.show("&gt; "+choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        }
    }

    //If the power is off in the elevator
    noPower() {
        this.engine.show("Nothing happens. You have to turn the power on first");
        this.engine.gotoScene(Location, "Elevator");
    }
    noKey() {
        this.engine.show("The door to the security office won't open. You need a keycard");
        this.engine.gotoScene(Location, "UpperLevel");
    }

    turnOnPower() {
        this.engine.powerOn = true;
        this.engine.show("*The power turns on*");
        this.engine.gotoScene(Location, "ElectricalRoom");
    }

    openExit() {
        this.engine.exitOpen = true;
        this.engine.show("*You hear the main entrance unlock*");
        this.engine.gotoScene(Location, "SecurityOffice");
    }

    getCar() {
        this.engine.car = true;
        this.engine.show("*You pick up the RC Car. This might be useful to access a blocked area*");
        this.engine.gotoScene(Location, "Kiosk");
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'game1b.json');