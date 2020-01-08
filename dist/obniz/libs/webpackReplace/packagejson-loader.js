"use strict";
module.exports = function (source) {
    this.cacheable && this.cacheable();
    try {
        let src = JSON.parse(source);
        let output = {};
        for (let key of Object.keys(src)) {
            if (key.startsWith('_')) {
                continue;
            }
            output[key] = src[key];
        }
        return JSON.stringify(output, undefined, '\t');
    }
    catch (err) {
        this.emitError(err);
        return null;
    }
};

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL3dlYnBhY2tSZXBsYWNlL3BhY2thZ2Vqc29uLWxvYWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLE1BQU07SUFDOUIsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDbkMsSUFBSTtRQUNGLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0IsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBRWhCLEtBQUssSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNoQyxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ3ZCLFNBQVM7YUFDVjtZQUNELE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDeEI7UUFFRCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUNoRDtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNwQixPQUFPLElBQUksQ0FBQztLQUNiO0FBQ0gsQ0FBQyxDQUFDIiwiZmlsZSI6Im9ibml6L2xpYnMvd2VicGFja1JlcGxhY2UvcGFja2FnZWpzb24tbG9hZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzb3VyY2UpIHtcbiAgdGhpcy5jYWNoZWFibGUgJiYgdGhpcy5jYWNoZWFibGUoKTtcbiAgdHJ5IHtcbiAgICBsZXQgc3JjID0gSlNPTi5wYXJzZShzb3VyY2UpO1xuICAgIGxldCBvdXRwdXQgPSB7fTtcblxuICAgIGZvciAobGV0IGtleSBvZiBPYmplY3Qua2V5cyhzcmMpKSB7XG4gICAgICBpZiAoa2V5LnN0YXJ0c1dpdGgoJ18nKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIG91dHB1dFtrZXldID0gc3JjW2tleV07XG4gICAgfVxuXG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG91dHB1dCwgdW5kZWZpbmVkLCAnXFx0Jyk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHRoaXMuZW1pdEVycm9yKGVycik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn07XG4iXX0=
