const UserModel = require("../models/userModel");

const saveToilet = async (req, res) => {
    const { toiletId, userId } = req.params;
    try {
        const user = await UserModel.findByIdAndUpdate(
            userId,
            { $addToSet: { favoriteToilets: toiletId } },
            { new: true })
        !user ?
            (
                res.status(404).json({ message: "User not found" })
            ) : (
                res.status(200).json({ message: "Toilet saved successfully" })
            )

    } catch (error) {
        res.status(400).json({ error: error.message })

    }
}

const unsaveToilet = async (req, res) => {
    const { toiletId, userId } = req.params;
    try {
        const user = await UserModel.findByIdAndUpdate(
            userId,
            { $pull: { favoriteToilets: toiletId } },
            { new: true })
        !user ?
            (
                res.status(404).json({ message: "User not found" })
            ) : (
                res.status(200).json({ message: "Toilet removed successfully" })
            )

    } catch (error) {
        res.status(400).json({ error: error.message })

    }
}

const createReview = async (req, res) => {
    const { userId, toiletId } = req.params;
    const { reviewText } = req.body;
    const session = await mongoose.startSession();

    if (!reviewText || !reviewText.trim()) {
        res.status(400).json({ message: "Review text is required", });
        return false;
    }

    try {
        session.startTransaction();

        const user = await UserModel.findById(userId).session(session);

        if (!user) {
            await session.abortTransaction();
            res.status(404).json({ message: "User not found", });
            return false;
        }

        const toilet = await ToiletModel.findById(toiletId).session(session);

        if (!toilet) {
            await session.abortTransaction();
            res.status(404).json({ message: "Toilet not found", });
            return false;
        }

        const [review] = await ReviewModel.create([{
            toilet: toiletId,
            user: userId,
            text: reviewText.trim(),
        }],
            { session }
        );

        user.reviews.push(review._id);
        await user.save({ session });

        toilet.reviews.push(review._id);
        await toilet.save({ session });

        await session.commitTransaction();

        res.status(201).json({ message: "Review created successfully", review });

        return true;

    } catch (error) {
        await session.abortTransaction();

        console.error("Create review error:", error);

        // Duplicate review
        if (error.code === 11000) {
            return res.status(409).json({
                message: "You have already reviewed this toilet",
            });
        }

        return res.status(500).json({
            message: "Failed to create review",
        });

    } finally {
        await session.endSession();
    }
};


module.exports = {
    saveToilet,
    unsaveToilet,
    createReview,
}