class Link {
    constructor(fromStop, line) {
        this.lines = [line];
        this.fromStop = fromStop;
        this.times = [];
    }

    addLine(line) {
        this.lines.push(line);
    }

    addTime(time) {
        this.times.push(time);
    }

    getEstimatedTime() {
        const sum = this.times.reduce((accumulator, time) => {
            return accumulator + time;
        }, 0);
        return sum / this.times.length;
    }
}

class Stop {
    constructor({id, long, lat}) {
        this.id = id;
        this.long = long;
        this.lat = lat;
        this.links = {};
        this.buses = [];
    }

    addFrom(fromStop, line) {
        if (this.links[fromStop.id]) {
            this.links[fromStop.id].addLine(line);
        } else {
            this.links[fromStop.id] = new Link(fromStop, line);
        }
    }

    addBus(bus, fromStop) {
        if (fromStop) {
            console.log(`Bus ${bus} moved from ${fromStop} to ${this}`);
            fromStop.removeBus(bus);

            if (this.links[fromStop.id]) { // This means that the bus comes from the previous stop.
                const deltaTime = bus.timestamp - bus.stopArrivalTime;
                if (true) { // Here we can add conditions like when the delay is bigger than 20s discard
                    this.links[fromStop.id].addTime(deltaTime);
                }
            }
        }
        bus.stop = this;
        bus.stopArrivalTime = bus.timestamp;
        this.buses.push(bus);
    }

    removeBus(bus) {
        this.buses = this.buses.filter(({ id }) => id !== bus.id);
        bus.stop = null;
    }

    findPrevStopByLineId(lineId) {
        const link = Object.values(this.links).find( (link) => {
            return link.lines.indexOf(lineId) !== -1;
        });
        return (link ? link.fromStop : null);
    }

    toString() {
        return this.id;
    }
}

module.exports = Stop;
